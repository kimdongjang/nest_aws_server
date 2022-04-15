import Link from 'next/link';
import React from 'react'
import { post } from '../types/post';
import style from '../styles/board.module.css'
import { useRouter } from 'next/router';

function boards(props: any) {
    const router = useRouter()
    const handlePostClick = (row:string) => {
        router.push(`/boards/posts?title=`+row);
    }
    return <div>
        <div className={style.tableWrap}>
        <table className={style.tableColumnList}>
            <colgroup>
                <col width="140" />
                <col width="auto" />
                <col width="140" />
                <col width="120" />
            </colgroup>
            <thead>
                <tr >
                    <th className={style.tableColumnListHeader}>번호</th>
                    <th className={style.tableColumnListHeader}>제목</th>
                    <th className={style.tableColumnListHeader}>등록일</th>
                    <th className={style.tableColumnListHeader}>조회수</th>
                </tr>
            </thead>
            <tbody>            
                {props && props.posts.map((value: post, index: any) => (
                        <tr onClick={()=>handlePostClick(value.title)}>s
                        <td className={style.tableColumnListData} key={index}>{value.post_id}</td>
                        <td className={style.tableColumnListData} key={index}>{value.title}</td>
                        <td className={style.tableColumnListData} key={index}>{value.apply_date}</td>
                        <td className={style.tableColumnListData} key={index}>{value.count}</td>
                        </tr>
                ))}
               
            </tbody>
        </table>
        </div>
        {/* <ul>
            {props && props.posts.map((value: post, index: any) => (
                <li key={index}>
                    <Link href={value.url}>
                        <a>{value.title}</a>
                    </Link>
                </li>
            ))}
        </ul> */}
    </div>;
}

export async function getStaticProps() {
    // 외부 API Endpoint로 Call해서 Post로 정보를 가져온다.
    // const res = await fetch("https://.../posts");
    // const posts = await res.json();
    const posts: Array<post> = [
        { post_id: 1, title: "test1", author: "user1", url: "http://ma" },
        { post_id: 2, title: "test2", author: "user2", url: "http://ma" },
        { post_id: 3, title: "test3", author: "user3", url: "http://ma" },
        { post_id: 4, title: "test4", author: "user4", url: "http://ma" },
    ]

    // posts 데이터가 담긴 prop를 빌드 시간에 Blog 컴포넌트로 전달한다.
    return {
        props: {
            posts
        }
    };
}

export default boards;

// boards.getStaticProps = async (ctx:any) => {
//     const res = await fetch('https://api.github.com/repos/vercel/next.js')
//     const json = await res.json()
//     return { posts: json.stargazers_count }
// }