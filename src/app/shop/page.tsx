"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { shopProducts } from "@/lib/shop-products";

export default function ShopPage() {
  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <p className="rm-label text-brand-light">Revive Motion Shop</p>
        <h1 className="rm-title text-3xl text-white">Recovery devices & braces</h1>
        <p className="mt-2 text-body">
          Support braces designed to work with your Revive Motion sensor during rehab.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {shopProducts.map((product) => (
            <article key={product.id} className="rm-card-elevated overflow-hidden">
              <div className="flex h-48 items-center justify-center bg-surface-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="rm-label capitalize text-brand-light">{product.category.replace("-", " ")}</p>
                <h2 className="mt-1 text-xl font-bold">{product.name}</h2>
                <p className="mt-2 text-sm text-body">{product.description}</p>
                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {product.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-2xl font-bold text-gold">${product.price}</p>
                  <button
                    type="button"
                    className="rm-btn rm-btn-brand px-5 py-3 text-sm"
                    onClick={() =>
                      alert(`${product.name} added to cart (demo — no checkout in this app).`)
                    }
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/" className="text-brand-light hover:text-brand">
            ← Back to home
          </Link>
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
