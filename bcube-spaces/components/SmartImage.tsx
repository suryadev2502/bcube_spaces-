import Image, { type ImageProps } from "next/image";

/** next/image wrapper: SVG placeholders and unknown hosts are served unoptimized. */
export default function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "__none__";
  const optimizable = src.startsWith("/") ? !src.endsWith(".svg") : src.includes(supabaseHost);
  return <Image {...props} alt={props.alt ?? ""} unoptimized={!optimizable || props.unoptimized} />;
}
