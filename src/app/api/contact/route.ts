import { NextResponse } from "next/server";

type ContactPayload={name?:unknown;email?:unknown;company?:unknown;projectType?:unknown;message?:unknown};
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request:Request){
  let body:ContactPayload;
  try{body=await request.json()}catch{return NextResponse.json({message:"Invalid request."},{status:400})}
  const name=typeof body.name==="string"?body.name.trim():"";
  const email=typeof body.email==="string"?body.email.trim():"";
  const message=typeof body.message==="string"?body.message.trim():"";
  if(name.length<2)return NextResponse.json({message:"Please enter your name."},{status:422});
  if(!emailPattern.test(email))return NextResponse.json({message:"Please enter a valid email address."},{status:422});
  if(message.length<20||message.length>2000)return NextResponse.json({message:"Message must be between 20 and 2,000 characters."},{status:422});
  // Demo adapter: replace this return with a Resend/SendGrid call before launch.
  return NextResponse.json({message:"Thank you. This demo inquiry was validated successfully."},{status:200});
}
