import { EditProfileForm } from '@/components/auth/EditProfileForm';
import { getMe } from '@/lib/data';

export default async function EditProfilePage() {
  const user = await getMe();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-headline">Edit Profile</h1>
            <p className="text-muted-foreground mt-2">Update your profile information.</p>
        </header>
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}
