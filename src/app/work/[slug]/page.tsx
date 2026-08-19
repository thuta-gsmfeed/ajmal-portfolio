import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { products } from "@/data/content";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  const title = `${product.name} Case Study`;
  const url = `/work/${product.slug}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: { title, description: product.description, url, type: "article", images: [] },
    twitter: { card: "summary", title, description: product.description, images: [] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <CaseStudyPage product={product} />;
}
