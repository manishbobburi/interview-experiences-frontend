import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ProtectedRoutes from './ProtectedRoutes';
import { postsLoader } from '../features/posts/posts.loader';
import PostsPage from '../features/posts//pages/PostsPage';
import SignInPage from '../features/auth/pages/SignInPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import { Offline, ServerError, NotFound } from '../pages'
import CreatePostModal from '../features/posts/components/CreatePostModal';
import UserProfilePage from '../features/user/pages/UserProfilePage';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "signin",
                element: <SignInPage />,
            },
            {
                path: "signup",
                element: <SignUpPage />,
            },
            {
                path: "user/:userId",
                element: <UserProfilePage />,
            },
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        index: true,
                        element: <PostsPage />,
                        loader: postsLoader,
                    },
                    {
                        path: "post",
                        element: <CreatePostModal />
                    }
                ],
            },
            {
                path: "offline",
                element: <Offline />,
            },
            {
                path: "500",
                element: <ServerError />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])