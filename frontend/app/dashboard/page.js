"use client"
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userAtom } from "../../utils/atom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/signin');
        }
    }, [user, router]);

    const handleLogout = () => {
        setUser(null);
        router.push('/signin');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">deAuth Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FaUser className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Authentication Method
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                                                {user.method}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FaUser className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Identifier
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {user.name}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FaUser className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Created At
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    Authentication Status
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                                    <p>You are successfully authenticated using {user.method} authentication.</p>
                                </div>
                                <div className="mt-5">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Authenticated
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}