import * as React from 'react';
import { Typography } from '@material-ui/core';
import './BlogList.scss';
import { Pills } from '../../components';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

export type IBlogFormat = {
    title: string,
    description: string,
    date: string,
    views: number,
    likes: number,
    author: string,
    labels: Array<string>
}

type IProps = {
    data: Array<IBlogFormat>;
}

const BlogList: React.FunctionComponent<IProps> = (props: IProps) => {

    let { data } = props;
    return (
        <main id="BlogList">
            {
                props.data === null
                    ? <Skeleton height={800} animation="wave" />
                    : data.map((v, i) => {
                        return (
                            <section key={i} className="blog-item">
                                <section className="blog-pills">
                                    <Pills datas={v.labels} />
                                </section>
                                <section className="title">
                                    <Typography variant="h5" gutterBottom>
                                        <Link to={{
                                            pathname: "/blog/detail/" + v.title,
                                            search: `&t=${v.title}&a=${v.author}&d=${v.date}&v=${v.views}&l=${v.likes}&lb=${JSON.stringify(v.labels)}`,
                                            state: { fromDashboard: true }
                                        }}>{v.title}</Link>
                                    </Typography>
                                </section>
                                <section className="subtitle">
                                    <Typography variant="subtitle1" gutterBottom>{v.description}</Typography>
                                </section>
                                <section className="else">
                                    <div className="viewstate">
                                        <i className="fas fa-eye" style={{ marginTop: "2px" }}></i>
                                        <Typography variant="body2" style={{ margin: "0 40px 0 10px" }}>{v.views}</Typography>
                                        <i className="fas fa-thumbs-up"></i>
                                        <Typography variant="body2" style={{ margin: "0 0 0 10px" }}>{v.likes}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{v.author}&nbsp;&nbsp;·&nbsp;&nbsp;{v.date}</Typography>
                                    </div>
                                </section>
                            </section>
                        )
                    })
            }
        </main>
    )
}

export default BlogList;