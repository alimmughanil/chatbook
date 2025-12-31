import { usePage } from "@inertiajs/react";

export default function ApplicationLogo() {
  const {appName} = usePage().props

  return (
    <p className="text-white text-xl font-medium scale-y-[110%]">
      <span>{appName}</span>
    </p>
  );
}
