#!/usr/bin/env node
/**
 * 테넌트별 components/brand-logo.tsx 생성 (마크 + HTML 워드마크)
 * Usage: node common/scripts/generate-brand-logo-component.js [--slug=sports] [--all]
 */
const fs = require('fs')
const path = require('path')
const { getBrand, getWordmarkParts } = require('../lib/tenant-branding-config')

const ROOT = path.join(__dirname, '../..')
const onlySlug = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1]
const all = process.argv.includes('--all')

function listTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
    .filter((e) => fs.existsSync(path.join(ROOT, e.name, 'package.json')))
    .map((e) => e.name)
    .filter((n) => !['common', 'resty-api', 'restyserver'].includes(n))
    .sort()
}

function colorClass(color) {
  if (color === 'foreground') return 'text-foreground'
  return `text-[${color}]`
}

function buildComponent(slug) {
  const brand = getBrand(slug)
  const parts = getWordmarkParts(slug, brand)
  const invert = slug === 'foodsns'

  const wordmarkJsx = parts
    .map((p) => `          <span className="${colorClass(p.color)}">${p.text.replace(/'/g, "\\'")}</span>`)
    .join('\n')

  const invertProp = invert
    ? `
  invert?: boolean`
    : ''

  const invertParam = invert ? ',\n  invert = false,' : ''

  const invertClass = invert ? '\n      className={cn("shrink-0", invert && "brightness-0 invert")}' : '\n      className="shrink-0"'

  return `import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  href?: string
  variant?: "full" | "mark"
  size?: "sm" | "md" | "lg"
  className?: string${invertProp}
}

const sizes = {
  sm: { mark: 32, text: "text-base" },
  md: { mark: 36, text: "text-lg" },
  lg: { mark: 40, text: "text-xl" },
}

export function BrandLogo({
  href = "/",
  variant = "full",
  size = "md",
  className${invertParam}
}: BrandLogoProps) {
  const s = sizes[size]

  const mark = (
    <Image
      src="/logo-mark.svg"
      alt=""
      width={s.mark}
      height={s.mark}
      priority${invertClass}
      aria-hidden
    />
  )

  const content =
    variant === "mark" ? (
      mark
    ) : (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        {mark}
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none whitespace-nowrap",
            s.text,
          )}
        >
${wordmarkJsx}
        </span>
      </span>
    )

  if (!href) return content
  return (
    <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
      {content}
    </Link>
  )
}
`
}

function writeForSlug(slug) {
  const dir = path.join(ROOT, slug, 'components')
  if (!fs.existsSync(path.join(ROOT, slug, 'package.json'))) return null
  fs.mkdirSync(dir, { recursive: true })
  const out = path.join(dir, 'brand-logo.tsx')
  fs.writeFileSync(out, buildComponent(slug))
  return out
}

const slugs = onlySlug ? [onlySlug] : all ? listTenants() : []
if (!slugs.length) {
  console.error('Usage: node generate-brand-logo-component.js --slug=NAME | --all')
  process.exit(1)
}

let n = 0
for (const slug of slugs) {
  const out = writeForSlug(slug)
  if (out) {
    n++
    console.log(`  ✓ ${slug}`)
  }
}
console.log(`[brand-logo] generated ${n} component(s)`)
