import Link from 'next/link';

export default function Menu() {
    return (
        <div>
            <header>
                <Link href="/"><a>Home</a></Link>
                <Link href="/"><a>About</a></Link>
                <Link href="/"><a>Shop</a></Link>
                <Link href="/"><a>ContactUs</a></Link>
            </header>
        </div>
    )
}