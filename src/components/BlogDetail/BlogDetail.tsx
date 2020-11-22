import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import request from '../../Api/api';
import { Pills } from '../../components/index';
import {Link} from 'react-router-dom';
import './BlogDetail.scss';
import Skeleton from '@material-ui/lab/Skeleton';
import marked from 'marked';
import gsap from 'gsap';


type IBlogDetailState = {
    labels: Array<string>,
    author: string,
    title: string
    date: string,
    views: number,
    likes: number,
    content: string,
    useMarkdown: boolean
}


const getQueryVariable = (url: string) => {
    var query = url.slice(1);
    var vars = query.split("&");
    const res = {};
    for (let i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        res[pair[0]] = pair[1];
    }
    return res as any;
}

const getBlogDetail = async (queryParams: string) => {
    const res = await request({
        url: "/api/getBlogDetail",
        method: "POST",
        body: {
            query: queryParams,
        }
    })
    if (res.ok === false) {
        return null;
    } else {
        return res.json();
    }
}



const BlogDetail: React.FunctionComponent<RouteComponentProps<{
    title: string;
}>> = (props) => {

    window.onscroll = () => {
        const sidebar: HTMLElement = document.querySelector(".terminal") as HTMLElement;
        if (sidebar && getComputedStyle(sidebar).position === "absolute")
            sidebar.style.top = String(window.pageYOffset) + 'px';
        else if (sidebar && getComputedStyle(sidebar).position === "sticky") {
            sidebar.style.top = "10px";
        }
    }

    const params = getQueryVariable(props.location.search);

    const [isLoading, setIsLoading] = React.useState(true);

    const [blogDetail, setBlogDetial] = React.useState<IBlogDetailState>({
        labels: JSON.parse(decodeURI(params.lb)),
        author: decodeURI(params.a),
        title: decodeURI(params.t),
        date: decodeURI(params.d),
        views: parseInt(params.v),
        likes: parseInt(params.l),
        content: "",
        useMarkdown: false
    });    

    React.useEffect(() => {
        gsap.to('ul.transition li', {
            scaleY: 1,
            transformOrigin: 'bottom left',
            stagger: .1,
            repeat: 1,
            yoyo: true,
            direction: 1
        });
        async function process() {
            const data = await getBlogDetail(decodeURI(params.t));
            if (data !== null) {
                setBlogDetial({
                    ...blogDetail,
                    content: data.content,
                    useMarkdown: data.useMarkdown
                })
            }
        }
        process();
        gsap.to('#blogDetail', {
            opacity: 1,
            duration: 1,
            delay: 1
        });

        setIsLoading(false);

        if (window.localStorage.getItem(blogDetail.title) === "ok") {
            const likebtn: HTMLElement = document.querySelector("#likebtn") as HTMLElement;
            likebtn.classList.add("likebtn-liked");
        }
    }, []);

    const handleClickLike = async () => {
        const likebtn: HTMLElement = document.querySelector("#likebtn") as HTMLElement;
        if (likebtn.classList.contains("likebtn-liked") === false) {
            const res = await request({
                url: `/api/updateLikesNum?title=${params.t}`,
                method: "PUT",
            })
            if (res.json().msg === "ok") {
                likebtn.classList.add("likebtn-liked");
                window.localStorage.setItem(blogDetail.title, "ok");
            }
        }
    }
    const scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, c - c / 8);
        }
    }
    return (
        <>
            <main id="blogDetail" style={{ opacity: 0}}>
                <section className="terminal">
                        <div className="terminal-btn">
                            <Link to="/blog">
                            <i className="fas fa-arrow-circle-left fa-2x"></i>
                            <div>back</div>
                            </Link>
                        </div>
                        <div className="terminal-btn" onClick={handleClickLike}>
                            <i className="fas fa-heart fa-2x likebtn" id="likebtn"></i>
                            <div>like</div>
                        </div>
                        <div className="terminal-btn">

                            <i className="fab fa-weixin fa-2x"></i>
                            <div>share</div>
                        </div>
                        <div className="terminal-btn" onClick={scrollToTop}>
                            <i className="fas fa-arrow-circle-left fa-2x" style={{ transform: 'rotate(90deg)' }}></i>
                            <div>top</div>
                        </div>
                </section>
                <section>
                    {
                        isLoading ? (
                            <Skeleton />
                        ) : (
                            <Pills datas={blogDetail.labels} />
                        )
                    }
                </section>
                <section>
                    <h1 className="title">{blogDetail.title}</h1>
                </section>
                <section className="bloginfo">
                    <span>Author: {blogDetail.author}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>Date: {blogDetail.date}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>Views: {blogDetail.views}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>Likes: {blogDetail.likes}</span>
                </section>
                <section className="bodytext">
                    {
                        isLoading ? (
                            <Skeleton variant="rect" height={400} animation="wave" />
                        ) : (
                            blogDetail.useMarkdown ? 
                            <section dangerouslySetInnerHTML={{ __html: marked(blogDetail.content)}} className="markdown-body"></section>
                            :<p>{blogDetail.content}</p>
                        )
                    }
                </section>
            </main>
        </>
    )
}

export default BlogDetail;