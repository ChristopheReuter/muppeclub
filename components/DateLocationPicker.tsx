"use client";

type Props = {
  dateTime: string;
  location: string;
  onDateTimeChange: (v: string) => void;
  onLocationChange: (v: string) => void;
};

export default function DateLocationPicker({ dateTime, location, onDateTimeChange, onLocationChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => onDateTimeChange(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Location</label>
        <input
          type="text"
          placeholder="City, Address, etc."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
        />
      </div>
    </div>
  );
}


