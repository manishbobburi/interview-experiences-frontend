import UserDetails from '../components/UserDetails';
import UserPosts from '../components/UserPosts';

function UserProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-25 ">
      <div className="flex flex-col-reverse lg:flex-row gap-5 items-stretch">

        <div className="lg:w-2/3 w-full">
          <UserPosts />
        </div>

        <div className="flex justify-center">
          <div
            className="
              w-[92%] h-px
              bg-linear-to-r from-transparent via-gray-300 to-transparent
              lg:w-px lg:h-[85%] lg:bg-linear-to-b
            "
          />
        </div>

        <div className="lg:w-1/3 w-full">
          <UserDetails />
        </div>

      </div>
    </div>
  );
}

export default UserProfilePage;
