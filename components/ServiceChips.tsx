"use client";

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function ServiceChips({ options, selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              "border border-black/10",
              isActive
                ? "bg-[#00A89D] text-white shadow hover:brightness-110 active:scale-95"
                : "bg-white text-gray-900 hover:bg-black/5 active:scale-95",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}


