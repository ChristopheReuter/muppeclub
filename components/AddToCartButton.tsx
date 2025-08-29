"use client";

import { useCart } from "@/components/cart/useCart";

type Props = {
  id: string;
  name: string;
  priceCents?: number;
};

export default function AddToCartButton({ id, name, priceCents }: Props) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add({ id, name, price: (priceCents ?? 0) / 100, qty: 1 })}
     className="rounded-full bg-[#00A89D] text-white px-3 py-1 text-sm hover:brightness-110 active:scale-95"
    >
      Add to Cart
    </button>
  );
}


