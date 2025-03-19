'use client'

import Header from "@/components/Header";
import "./styles.css"
import Image from "next/image";

import cover from '@/assets/cover.avif';
import Avatar from "@/components/Avatar";
import { PiPencilLineBold } from "react-icons/pi";
import Post from "@/components/Post";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

type Author = {
    name: string;
    role: string;
    avatarUrl: string;
}

type Post = {
    id: number;
    author: Author;
    publishedAt: Date;
    content: string;
}

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        loadPost();
    }, [])

    async function loadPost() {
        const response = await axios.get("http://localhost:3001/posts");

        const postSort = response.data.sort((a: any, b: any) => ((new Date(a.publishedAt as any)) as any) - ((new Date(b.publishedAt as any)) as any))

        setPosts(postSort)
    }

    async function handleCreatePost(event: FormEvent) {
        event.preventDefault()
        const post = {
            id: posts.length + 1,
            content: content,
            publishedAt: new Date().toISOString(),
            author: {
                name: "Gustavo Souza",
                role: "Full-Stack Developer",
                avatarUrl: "https://github.com/gusttavosouza.png"
            }
        }
        await axios.post("http://localhost:3001/posts", post);
        await loadPost();
        setContent('');
    }


    return (
        <div>
            <Header />
            <div className="container">
                <aside className="sidebar">
                    <Image src={cover} alt="cover" className="cover" />

                    <div className="profile">
                        <Avatar src="https://github.com/gusttavosouza.png" hasBorder />
                        <strong>Gustavo Souza</strong>
                        <span>Full-Stack Developer</span>

                        <footer>
                            <button className="button-edit-profile">
                                <PiPencilLineBold />
                                Editar seu perfil
                            </button>
                        </footer>
                    </div>
                </aside>

                <main className="main">
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            placeholder="O que você está pensando?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <button type="submit">PUBLICAR</button>
                    </form>

                    {posts.map(item => (
                        <Post post={item} key={item.id} />
                    ))}
                </main>
            </div>
        </div>
    )
}
