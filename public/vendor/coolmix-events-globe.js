(function () {
    'use strict';

    var root = document.querySelector('[data-events-globe]');
    var canvas = root && root.querySelector('[data-events-globe-canvas]');
    var loading = root && root.querySelector('[data-events-globe-loading]');
    var labels = root && root.querySelector('[data-events-globe-labels]');
    var mode = root ? (root.getAttribute('data-globe-mode') || 'events') : 'events';
    var dotTheme = root ? root.getAttribute('data-globe-dot-theme') : '';
    var pinScale = root && root.getAttribute('data-globe-pin-size') === 'compact' ? 0.78 : 1;
    var tightEdgeFit = root && root.getAttribute('data-globe-edge-fit') === 'tight';

    if (!root || !canvas || typeof window.THREE === 'undefined') {
        if (loading) loading.textContent = 'Globe unavailable';
        return;
    }

    var THREE = window.THREE;
    var radius = 100;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 2000);
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    var globe = new THREE.Group();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var frameId = null;
    var globeIsVisible = true;
    var dragging = false;
    var previousX = 0;
    var previousY = 0;
    var rotationSpeed = mode === 'partners' ? 0.0006 : (mode === 'shipping' ? 0.00048 : 0.00065);
    var velocity = rotationSpeed;
    var sparkleMaterial = null;
    var coastlineMaterial = null;
    var routeAgents = [];
    var routeCycleStarted = performance.now() - (mode === 'shipping' ? 7800 : 0);
    var targetRotation = null;

    camera.position.set(0, 7, 320);
    scene.add(globe);

    function latLonToVector(lat, lon, sphereRadius) {
        var phi = (90 - lat) * Math.PI / 180;
        var theta = (lon + 180) * Math.PI / 180;
        return new THREE.Vector3(
            -sphereRadius * Math.sin(phi) * Math.cos(theta),
            sphereRadius * Math.cos(phi),
            sphereRadius * Math.sin(phi) * Math.sin(theta)
        );
    }

    function pointInRing(lon, lat, ring) {
        var inside = false;
        for (var index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
            var x = ring[index][0];
            var y = ring[index][1];
            var previousXValue = ring[previous][0];
            var previousYValue = ring[previous][1];
            if (((y > lat) !== (previousYValue > lat)) &&
                (lon < (previousXValue - x) * (lat - y) / (previousYValue - y) + x)) {
                inside = !inside;
            }
        }
        return inside;
    }

    function flattenLand(data) {
        var polygons = [];
        (data.features || []).forEach(function (feature) {
            var geometry = feature.geometry;
            if (!geometry) return;
            if (geometry.type === 'Polygon') polygons.push(geometry.coordinates);
            if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach(function (polygon) { polygons.push(polygon); });
            }
        });
        return polygons;
    }

    function isLand(lon, lat, polygons) {
        return polygons.some(function (polygon) {
            if (!pointInRing(lon, lat, polygon[0])) return false;
            return !polygon.slice(1).some(function (hole) { return pointInRing(lon, lat, hole); });
        });
    }

    function continentFallback() {
        var rings = [
            [[-168,71],[-140,60],[-125,49],[-117,32],[-95,18],[-84,10],[-77,8],[-81,-4],[-70,-18],[-72,-33],[-68,-55],[-43,-23],[-35,-8],[-51,3],[-62,10],[-95,18],[-90,30],[-74,40],[-60,47],[-65,60],[-90,65],[-130,70],[-168,71]],
            [[-9,36],[2,51],[21,61],[40,70],[60,60],[78,42],[100,35],[122,40],[140,50],[170,60],[178,65],[140,72],[80,73],[40,68],[20,50],[27,38],[45,40],[73,8],[94,16],[120,5],[146,-16],[151,-33],[143,-39],[115,-32],[113,-10],[98,1],[73,8],[43,4],[33,-25],[20,-34],[18,-33],[13,-10],[-3,5],[-17,15],[-13,28],[-9,36]],
            [[48,-13],[50,-25],[45,-40],[35,-35],[30,-20],[35,-10],[43,-1],[48,-13]]
        ];
        return rings.map(function (ring) { return [ring]; });
    }

    function buildLandDots(polygons) {
        var points = [];
        var count = mode === 'shipping' ? 22000 : 36000;
        var landDotRadius = radius;
        var phases = [];
        var goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (var index = 0; index < count; index++) {
            var y = 1 - index / (count - 1) * 2;
            var lat = Math.asin(y) * 180 / Math.PI;
            var lon = (goldenAngle * index * 180 / Math.PI) % 360;
            if (lon > 180) lon -= 360;
            if (isLand(lon, lat, polygons)) {
                points.push(latLonToVector(lat, lon, landDotRadius));
                phases.push(Math.random() * Math.PI * 2);
            }
        }

        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
        var landDotFragment = mode === 'shipping' || mode === 'events' || dotTheme === 'white'
            ? 'varying float glow;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=smoothstep(.5,.08,d)*(.5+glow*.5);vec3 whiteSparkle=mix(vec3(.58,.72,.92),vec3(1.0),glow);gl_FragColor=vec4(whiteSparkle,a);}'
            : 'varying float glow;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=smoothstep(.5,.08,d)*(.48+glow*.52);vec3 gold=mix(vec3(.72,.35,.035),vec3(1.0,.79,.28),glow);gl_FragColor=vec4(gold,a);}';
        sparkleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                dotScale: { value: getLandDotScale() }
            },
            vertexShader: 'uniform float time;uniform float dotScale;attribute float aPhase;varying float glow;void main(){vec4 mvPosition=modelViewMatrix*vec4(position,1.0);glow=.58+.42*sin(time*2.1+aPhase);gl_PointSize=(1.45+glow*1.35)*dotScale*(300.0/-mvPosition.z);gl_Position=projectionMatrix*mvPosition;}',
            fragmentShader: landDotFragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var landDots = new THREE.Points(geometry, sparkleMaterial);
        landDots.renderOrder = 2;
        globe.add(landDots);
        buildCoastlineDots(polygons);
        if (loading) loading.hidden = true;
    }

    function buildCoastlineDots(polygons) {
        var points = [];
        var phases = [];
        var sampleStep = mode === 'shipping' ? 1.35 : 1.05;

        polygons.forEach(function (polygon) {
            var coastline = polygon[0] || [];
            for (var index = 1; index < coastline.length; index++) {
                var start = coastline[index - 1];
                var end = coastline[index];
                var longitudeDelta = end[0] - start[0];
                if (longitudeDelta > 180) longitudeDelta -= 360;
                if (longitudeDelta < -180) longitudeDelta += 360;
                var latitudeDelta = end[1] - start[1];
                var steps = Math.max(1, Math.ceil(Math.max(Math.abs(longitudeDelta), Math.abs(latitudeDelta)) / sampleStep));

                for (var step = 0; step < steps; step++) {
                    var progress = step / steps;
                    var longitude = start[0] + longitudeDelta * progress;
                    if (longitude > 180) longitude -= 360;
                    if (longitude < -180) longitude += 360;
                    points.push(latLonToVector(
                        start[1] + latitudeDelta * progress,
                        longitude,
                        radius * 1.002
                    ));
                    phases.push(Math.random() * Math.PI * 2);
                }
            }
        });

        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
        var coastlineDotFragment = mode === 'shipping' || mode === 'events' || dotTheme === 'white'
            ? 'varying float glow;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=smoothstep(.5,.16,d)*(.66+glow*.34);vec3 whiteSparkle=mix(vec3(.7,.82,.98),vec3(1.0),glow);gl_FragColor=vec4(whiteSparkle,a);}'
            : 'varying float glow;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=smoothstep(.5,.16,d)*(.62+glow*.38);vec3 gold=mix(vec3(1.0,.48,.08),vec3(1.0,.82,.32),glow);gl_FragColor=vec4(gold,a);}';
        coastlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                dotScale: { value: getLandDotScale() }
            },
            vertexShader: 'uniform float time;uniform float dotScale;attribute float aPhase;varying float glow;void main(){vec4 mvPosition=modelViewMatrix*vec4(position,1.0);glow=.58+.42*sin(time*2.45+aPhase);gl_PointSize=(2.72+glow*.46)*dotScale*(300.0/-mvPosition.z);gl_Position=projectionMatrix*mvPosition;}',
            fragmentShader: coastlineDotFragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var coastlineDots = new THREE.Points(geometry, coastlineMaterial);
        coastlineDots.renderOrder = 3;
        globe.add(coastlineDots);
    }

    function getLandDotScale() {
        if (mode !== 'shipping') return 1;
        if (window.innerWidth <= 767) return 1.9;
        if (window.innerWidth <= 1728) return 1.75;
        return 1;
    }

    globe.add(new THREE.Mesh(
        new THREE.SphereGeometry(radius * (mode === 'partners' ? 0.984 : (tightEdgeFit ? 0.998 : 0.985)), 64, 64),
        new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true })
    ));

    var eventLocations = [
        { name: 'Malta', lat: 35.8989, lon: 14.5146 },
        { name: 'Berlin', lat: 52.52, lon: 13.405 },
        { name: 'Portugal', lat: 37.0891, lon: -8.2479 },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
        { name: 'Mexico', lat: 19.4326, lon: -99.1332 },
        { name: 'Miami', lat: 25.7617, lon: -80.1918 },
        { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
        { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
        { name: 'Colombia', lat: 6.2442, lon: -75.5812 },
        { name: 'Paraguay', lat: -25.5167, lon: -54.6167 }
    ];
    var shippingLocations = [
        { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
        { name: 'London', lat: 51.5072, lon: -0.1276 },
        { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
        { name: 'Brussels', lat: 50.8503, lon: 4.3517 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin', lat: 52.52, lon: 13.405 },
        { name: 'Warsaw', lat: 52.2297, lon: 21.0122 },
        { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
        { name: 'Lisbon', lat: 38.7223, lon: -9.1393 },
        { name: 'Rome', lat: 41.9028, lon: 12.4964 },
        { name: 'Milan', lat: 45.4642, lon: 9.19 },
        { name: 'Athens', lat: 37.9838, lon: 23.7275 },
        { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
        { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
        { name: 'Riyadh', lat: 24.7136, lon: 46.6753 },
        { name: 'Doha', lat: 25.2854, lon: 51.531 },
        { name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
        { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
        { name: 'Accra', lat: 5.6037, lon: -0.187 },
        { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
        { name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
        { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
        { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
        { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
        { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
        { name: 'Bogotá', lat: 4.711, lon: -74.0721 },
        { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
        { name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
        { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
        { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
        { name: 'New York', lat: 40.7128, lon: -74.006 },
        { name: 'Miami', lat: 25.7617, lon: -80.1918 },
        { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
        { name: 'Delhi', lat: 28.6139, lon: 77.209 },
        { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
        { name: 'Kuala Lumpur', lat: 3.139, lon: 101.6869 },
        { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
        { name: 'Manila', lat: 14.5995, lon: 120.9842 },
        { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
        { name: 'Shenzhen', lat: 22.5431, lon: 114.0579 },
        { name: 'Taipei', lat: 25.033, lon: 121.5654 },
        { name: 'Seoul', lat: 37.5665, lon: 126.978 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
        { name: 'Auckland', lat: -36.8509, lon: 174.7645 }
    ];
    var partnerLocations = {
        ajmal: [{ name: 'Dubai', lat: 25.2048, lon: 55.2708 }],
        vipin: [{ name: 'India', lat: 22.8, lon: 79 }],
        milad: [{ name: 'Netherlands', lat: 52.2, lon: 5.3 }],
        ali: [{ name: 'Belgium', lat: 50.7, lon: 4.6 }],
        amir: [{ name: 'France', lat: 46.5, lon: 2.2 }],
        illia: [{ name: 'Poland', lat: 52, lon: 19.1 }],
        borja: [{ name: 'Spain', lat: 40.3, lon: -3.5 }]
    };
    var allPartnerLocations = [];
    if (mode === 'partners') {
        var seenPartnerLocations = {};
        Object.keys(partnerLocations).forEach(function (partner) {
            partnerLocations[partner].forEach(function (location) {
                if (seenPartnerLocations[location.name]) return;
                seenPartnerLocations[location.name] = true;
                allPartnerLocations.push(location);
            });
        });
    }
    var locations = mode === 'partners' ? allPartnerLocations : (mode === 'shipping' ? shippingLocations : eventLocations);
    var markerItems = [];

    function addMarker(location) {
        var markerRadius = (mode === 'shipping' ? 1 : (mode === 'partners' ? 1.85 : 1.65)) * pinScale;
        var markerColor = mode === 'partners' ? 0x2f67ff : (mode === 'shipping' ? 0xd94a16 : 0x2f67ff);
        var marker = new THREE.Mesh(
            new THREE.SphereGeometry(markerRadius, 12, 12),
            new THREE.MeshBasicMaterial({ color: markerColor, depthTest: true, depthWrite: false })
        );
        marker.position.copy(latLonToVector(location.lat, location.lon, radius * 1.012));
        marker.renderOrder = 5;
        globe.add(marker);

        var markerGlow = null;
        if (mode === 'partners') {
            markerGlow = new THREE.Mesh(
                new THREE.SphereGeometry(4.4 * pinScale, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xe84b12, transparent: true, opacity: 0.3,
                    blending: THREE.AdditiveBlending, depthWrite: false })
            );
            markerGlow.position.copy(marker.position);
            markerGlow.renderOrder = 4;
            markerGlow.visible = false;
            globe.add(markerGlow);
        }

        var label = document.createElement('span');
        label.className = 'events-globe-label';
        label.textContent = location.name;
        if (labels) labels.appendChild(label);
        markerItems.push({ marker: marker, glow: markerGlow, label: label, location: location, world: new THREE.Vector3() });
    }

    locations.forEach(addMarker);
    if (loading && mode === 'shipping') loading.hidden = true;

    function routeMaterial(color, opacity) {
        return new THREE.ShaderMaterial({
            uniforms: {
                head: { value: 0 },
                tail: { value: 0 },
                opacity: { value: opacity },
                routeColor: { value: new THREE.Color(color) }
            },
            vertexShader: 'varying float routePosition;void main(){routePosition=uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
            fragmentShader: 'uniform float head;uniform float tail;uniform float opacity;uniform vec3 routeColor;varying float routePosition;void main(){if(routePosition>head||routePosition<tail)discard;float tailFade=smoothstep(tail,min(1.0,tail+.2),routePosition);gl_FragColor=vec4(routeColor,opacity*tailFade);}',
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }

    function buildAgentLeg(agent, legNumber) {
        if (agent.core) {
            globe.remove(agent.core);
            globe.remove(agent.glow);
            globe.remove(agent.ripple);
            agent.core.geometry.dispose();
            agent.glow.geometry.dispose();
            agent.ripple.geometry.dispose();
            agent.coreMaterial.dispose();
            agent.glowMaterial.dispose();
            agent.rippleMaterial.dispose();
        }

        var sourceIndex = (agent.originIndex + legNumber) % locations.length;
        var location = locations[sourceIndex];
        var next = locations[(sourceIndex + 1) % locations.length];
        var start = latLonToVector(location.lat, location.lon, radius * 1.014);
        var end = latLonToVector(next.lat, next.lon, radius * 1.014);
        var midpoint = start.clone().add(end).multiplyScalar(0.5).normalize()
            .multiplyScalar(radius + start.distanceTo(end) * 0.34);
        var curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
        var glowMaterial = routeMaterial(0xff351c, 0.16);
        var coreMaterial = routeMaterial(0xe9461b, 0.94);
        var glowRadius = mode === 'shipping' ? 0.56 : 0.72;
        var coreRadius = mode === 'shipping' ? 0.26 : 0.34;
        var glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, glowRadius, 6, false), glowMaterial);
        var core = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, coreRadius, 6, false), coreMaterial);
        var rippleMaterial = new THREE.MeshBasicMaterial({
            color: 0xff2418,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        var ripple = new THREE.Mesh(new THREE.RingGeometry(1.58, 1.7, 48), rippleMaterial);
        ripple.position.copy(end.clone().normalize().multiplyScalar(radius * 1.018));
        ripple.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), end.clone().normalize());
        ripple.visible = false;
        glow.renderOrder = 3;
        core.renderOrder = 4;
        ripple.renderOrder = 6;
        globe.add(glow);
        globe.add(core);
        globe.add(ripple);
        agent.core = core;
        agent.glow = glow;
        agent.coreMaterial = coreMaterial;
        agent.glowMaterial = glowMaterial;
        agent.ripple = ripple;
        agent.rippleMaterial = rippleMaterial;
        agent.legNumber = legNumber;
    }

    if (mode !== 'partners') {
        var shippingRouteLimit = window.innerWidth <= 767 ? 18 : 28;
        var routeAgentCount = mode === 'shipping'
            ? Math.min(shippingRouteLimit, locations.length)
            : locations.length;
        for (var routeIndex = 0; routeIndex < routeAgentCount; routeIndex++) {
            var originIndex = mode === 'shipping'
                ? Math.floor(routeIndex * locations.length / routeAgentCount)
                : routeIndex;
            var agent = {
                originIndex: originIndex,
                legNumber: -1,
                startDelay: mode === 'shipping' ? (routeIndex * 2377) % 7200 : routeIndex * 1000
            };
            buildAgentLeg(agent, 0);
            routeAgents.push(agent);
        }
    }

    function selectPartner(partner) {
        if (mode !== 'partners' || !partnerLocations[partner]) return;
        var directoryCards = root.closest('.ibp-map-directory');
        Array.from(directoryCards ? directoryCards.querySelectorAll('.ibp-directory-card[data-ibp-partner]') : []).forEach(function (card) {
            var active = card.getAttribute('data-ibp-partner') === partner;
            card.classList.toggle('is-active', active);
            card.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        locations = partnerLocations[partner];
        var selectedNames = locations.map(function (item) { return item.name; });
        markerItems.forEach(function (item) {
            var isSelected = selectedNames.indexOf(item.location.name) !== -1;
            item.isSelected = isSelected;
            item.marker.material.color.setHex(isSelected ? 0xb93808 : 0x2f67ff);
            if (item.glow) {
                item.glow.visible = isSelected;
                item.glow.scale.set(1, 1, 1);
            }
        });
        var averageLon = locations.reduce(function (sum, item) { return sum + item.lon; }, 0) / locations.length;
        var averageLat = locations.reduce(function (sum, item) { return sum + item.lat; }, 0) / locations.length;
        targetRotation = {
            start: performance.now(), fromX: globe.rotation.x, fromY: globe.rotation.y,
            toX: averageLat * Math.PI / 180, toY: -(averageLon + 90) * Math.PI / 180
        };
        var partnerName = root.querySelector('[data-ibp-globe-partner]');
        var countryNames = root.querySelector('[data-ibp-globe-countries]');
        if (partnerName) partnerName.textContent = partner.charAt(0).toUpperCase() + partner.slice(1);
        if (countryNames) countryNames.textContent = locations.map(function (item) { return item.name; }).join(', ');
    }

    if (mode === 'partners') {
        root.addEventListener('ibp:select', function (event) { selectPartner(event.detail.partner); });
        var directory = root.closest('.ibp-map-directory');
        Array.from(directory ? directory.querySelectorAll('.ibp-directory-card[data-ibp-partner]') : []).forEach(function (card) {
            card.addEventListener('click', function (event) {
                if (!event.target.closest('a')) selectPartner(card.getAttribute('data-ibp-partner'));
            });
            card.addEventListener('keydown', function (event) {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                if (event.target.closest('a')) return;
                event.preventDefault();
                selectPartner(card.getAttribute('data-ibp-partner'));
            });
        });
        selectPartner('ajmal');
    }

    function loadLand() {
        var urls = [
            '/data/ne_110m_land.geojson?v=1.0.0',
            'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson',
            'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector/geojson/ne_110m_land.geojson'
        ];
        function tryUrl(index) {
            if (index >= urls.length) {
                buildLandDots(continentFallback());
                return;
            }
            fetch(urls[index]).then(function (response) {
                if (!response.ok) throw new Error('Land data unavailable');
                return response.json();
            }).then(function (data) {
                var polygons = flattenLand(data);
                if (!polygons.length) throw new Error('No land polygons');
                buildLandDots(polygons);
            }).catch(function () { tryUrl(index + 1); });
        }
        tryUrl(0);
    }

    function resize() {
        var width = root.clientWidth;
        var height = root.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        var maxPixelRatioForArea = Math.sqrt(8000000 / (width * height));
        var pixelRatio = Math.max(1, Math.min(
            window.devicePixelRatio || 1,
            2,
            maxPixelRatioForArea
        ));
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        camera.position.y = tightEdgeFit ? 0 : 7;
        camera.position.z = mode === 'shipping'
            ? (window.innerWidth <= 767 ? 410 : 360)
            : (mode === 'partners'
                ? (width < 560 ? 340 : (tightEdgeFit ? 325 : (dotTheme === 'white' ? 325 : 300)))
                : (width < 560 ? 355 : 320));
        var globeSize = height * radius / (camera.position.z * Math.tan(camera.fov * Math.PI / 360));
        root.style.setProperty('--events-globe-size', globeSize + 'px');
        if (sparkleMaterial) sparkleMaterial.uniforms.dotScale.value = getLandDotScale();
        if (coastlineMaterial) coastlineMaterial.uniforms.dotScale.value = getLandDotScale();
        if (!globeIsVisible) renderer.render(scene, camera);
    }

    canvas.addEventListener('pointerdown', function (event) {
        dragging = true;
        previousX = event.clientX;
        previousY = event.clientY;
        canvas.classList.add('is-dragging');
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', function (event) {
        if (!dragging) return;
        var deltaX = event.clientX - previousX;
        var deltaY = event.clientY - previousY;
        previousX = event.clientX;
        previousY = event.clientY;
        globe.rotation.y += deltaX * 0.005;
        globe.rotation.x += deltaY * 0.004;
        velocity = deltaX * 0.00045;
    });
    function resumeRotation() {
        dragging = false;
        velocity = rotationSpeed;
        canvas.classList.remove('is-dragging');
    }

    canvas.addEventListener('pointerup', resumeRotation);
    canvas.addEventListener('pointercancel', resumeRotation);
    canvas.addEventListener('lostpointercapture', resumeRotation);

    function render() {
        frameId = null;
        var now = performance.now();
        if (!dragging && !reducedMotion) {
            globe.rotation.y += velocity;
            velocity += (rotationSpeed - velocity) * 0.015;
        }
        if (targetRotation && !dragging) {
            var turnProgress = Math.min(1, (now - targetRotation.start) / 900);
            var turnEase = 1 - Math.pow(1 - turnProgress, 3);
            globe.rotation.x = targetRotation.fromX + (targetRotation.toX - targetRotation.fromX) * turnEase;
            globe.rotation.y = targetRotation.fromY + (targetRotation.toY - targetRotation.fromY) * turnEase;
            if (turnProgress === 1) targetRotation = null;
        }
        if (mode === 'partners' && !reducedMotion) {
            markerItems.forEach(function (item, index) {
                if (!item.glow || !item.glow.visible) return;
                var pulse = (Math.sin(now * 0.005 + index * 0.8) + 1) * 0.5;
                var popScale = 0.82 + pulse * 0.58;
                item.glow.scale.set(popScale, popScale, popScale);
                item.glow.material.opacity = 0.12 + pulse * 0.24;
            });
        }
        if (sparkleMaterial) sparkleMaterial.uniforms.time.value = reducedMotion ? 0 : now * 0.001;
        if (coastlineMaterial) coastlineMaterial.uniforms.time.value = reducedMotion ? 0 : now * 0.001;

        var travelDuration = 5600;
        var fadeDuration = 2400;
        var legDuration = travelDuration + fadeDuration;
        routeAgents.forEach(function (agent) {
            var elapsed = reducedMotion ? travelDuration : now - routeCycleStarted - agent.startDelay;
            var visible = elapsed >= 0;
            var legNumber = visible ? Math.floor(elapsed / legDuration) : 0;
            if (legNumber !== agent.legNumber) buildAgentLeg(agent, legNumber);
            var phase = visible ? elapsed % legDuration : 0;
            var travelProgress = Math.min(1, phase / travelDuration);
            var head = travelProgress * travelProgress * (3 - 2 * travelProgress);
            var fadeProgress = phase <= travelDuration ? 0 : (phase - travelDuration) / fadeDuration;
            var tail = phase <= travelDuration ? Math.max(0, head - .72) : .28 + fadeProgress * .72;
            agent.core.visible = visible;
            agent.glow.visible = visible;
            agent.coreMaterial.uniforms.head.value = head;
            agent.glowMaterial.uniforms.head.value = head;
            agent.coreMaterial.uniforms.tail.value = tail;
            agent.glowMaterial.uniforms.tail.value = tail;

            var rippleDuration = 1250;
            var rippleProgress = (phase - travelDuration) / rippleDuration;
            var rippleVisible = visible && phase >= travelDuration && rippleProgress <= 1;
            agent.ripple.visible = rippleVisible;
            if (rippleVisible) {
                var rippleEase = 1 - Math.pow(1 - rippleProgress, 2);
                var rippleScale = 0.35 + rippleEase * 1.55;
                agent.ripple.scale.set(rippleScale, rippleScale, rippleScale);
                agent.rippleMaterial.opacity = (1 - rippleProgress) * 0.78;
            }
        });
        globe.updateMatrixWorld(true);
        var cameraDirection = camera.position.clone().normalize();
        var visibleLabelPositions = [];
        markerItems.forEach(function (item) {
            item.marker.getWorldPosition(item.world);
            var projected = item.world.clone().project(camera);
            var isFrontFacing = item.world.clone().normalize().dot(cameraDirection) > 0.06;
            var isOnScreen = Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1;
            var screenX = (projected.x + 1) * 0.5 * root.clientWidth;
            var screenY = (1 - projected.y) * 0.5 * root.clientHeight;
            var overlaps = (mode === 'shipping' || mode === 'partners') && visibleLabelPositions.some(function (position) {
                return Math.abs(position.x - screenX) < 72 && Math.abs(position.y - screenY) < 25;
            });
            var belongsToSelectedPartner = mode !== 'partners' || item.isSelected === true;
            var showLabel = belongsToSelectedPartner && isFrontFacing && isOnScreen && !overlaps;
            item.label.style.left = ((projected.x + 1) * 50) + '%';
            item.label.style.top = ((1 - projected.y) * 50) + '%';
            item.label.classList.toggle('is-visible', showLabel);
            if (showLabel) visibleLabelPositions.push({ x: screenX, y: screenY });
        });
        renderer.render(scene, camera);
        if (globeIsVisible && !document.hidden) {
            frameId = window.requestAnimationFrame(render);
        }
    }

    function resumeRendering() {
        if (!frameId && globeIsVisible && !document.hidden) {
            frameId = window.requestAnimationFrame(render);
        }
    }

    var shippingInitialRotation = 2.15;
    globe.rotation.set(-0.12, mode === 'shipping' ? shippingInitialRotation : -0.72, 0);
    resize();
    loadLand();
    render();
    if ('IntersectionObserver' in window) {
        var renderObserver = new IntersectionObserver(function (entries) {
            globeIsVisible = entries.some(function (entry) { return entry.isIntersecting; });
            if (globeIsVisible) {
                resumeRendering();
            } else if (frameId) {
                window.cancelAnimationFrame(frameId);
                frameId = null;
            }
        }, { threshold: 0.01 });
        renderObserver.observe(root);
    }
    document.addEventListener('visibilitychange', resumeRendering);
    if (mode === 'shipping' && 'IntersectionObserver' in window) {
        var shippingEntryObserver = new IntersectionObserver(function (entries) {
            if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
            globe.rotation.set(-0.12, shippingInitialRotation, 0);
            velocity = rotationSpeed;
            shippingEntryObserver.disconnect();
        }, { threshold: 0.08 });
        shippingEntryObserver.observe(root);
    }
    if ('ResizeObserver' in window) {
        new ResizeObserver(resize).observe(root);
    } else {
        window.addEventListener('resize', resize);
    }
    window.addEventListener('pagehide', function () {
        if (frameId) window.cancelAnimationFrame(frameId);
        renderer.dispose();
    }, { once: true });
})();
