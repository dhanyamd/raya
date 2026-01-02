import { SidebarProvider } from '@/components/ui/sidebar'
import { currentUser } from '@/modules/authentication/actions'
import Header from '@/modules/Layout/components/header'
import { initializeWorkspace } from '@/modules/workspace/actions'
import TabbedLeftPanel from '@/modules/workspace/components/tabbed-left-pannel'
import { redirect } from 'next/navigation'
import React from 'react'

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser();

    if (!user) {
        return redirect('/sign-in');
    }

    const workspace = await initializeWorkspace();
    console.log("RootLayout workspace result:", workspace);

    return (
        <>
            {/* @ts-ignore */}
            <Header user={user} workspace={workspace.workspace!} />
            <main className='max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden'>
                <div className="flex h-full w-full">

                    <div className="w-12 border-r border-sidebar-border bg-sidebar shrink-0">
                        <TabbedLeftPanel />
                    </div>
                    <div className="flex-1 bg-background p-2">
                        <div className="h-full w-full bg-card rounded-xl border border-sidebar-border overflow-hidden shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default RootLayout