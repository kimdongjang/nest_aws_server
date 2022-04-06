import Head from "next/head"
import Navbar from "./Navbar";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: AppLayoutProps) {
    return (
        <>
            <Head>
                <title>Hello</title>
            </Head>
            <Navbar></Navbar>

            <div>{children}</div>
        </>
    )
}