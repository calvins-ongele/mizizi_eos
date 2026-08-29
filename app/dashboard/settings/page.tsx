import { getCurrentUser } from "@/app/lib/getCurrentUser";

export const metadata = {
  title: "Settings — MyApp",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return <p className="mt-10 text-center">Unauthorized</p>;

  return (
    <div className="space-y-4">
      <script>window.location.href='/dashboard/profile'</script>
      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="border rounded p-4 space-y-2">
        <p className="text-sm text-gray-600">
          This section will host account & security preferences.
        </p>

        <ul className="list-disc ml-5 text-sm">
          <li>Change password</li>
          <li>Update account email</li>
          <li>Enable secure session policies</li>
          <li>Notification preferences</li>
        </ul>
      </div>
    </div>
  );
}
