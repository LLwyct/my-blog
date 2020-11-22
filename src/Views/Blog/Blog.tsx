import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { BlogWritter, BlogList, BlogDetail } from '../../components';
import './blog.scss';
import {Switch, Route, Link} from 'react-router-dom';
import {IBlogFormat} from '../../components/BlogList/BlogList';
import request  from '../../Api/api';

type requestDataFormat = {
    title: string;
    description: string;
    createDate: string;
    views: number;
    likes: number;
    nickName: string;
    labels: string[];
}
type IState = {
    data: Array<IBlogFormat>;
}
type IProps = {

}

class BlogOverview extends React.Component<IProps, IState> {

    state: IState = {
        data: []
    }

    async componentDidMount () {
        try {
            const data = await request({
                url: "/api/getAllBlogs",
                method: "GET",
            })
            this.setState(prevState => ({
                data: data.json().map((item: requestDataFormat) => {
                        const temp: IBlogFormat = {
                            title: item.title,
                            description: item.description,
                            date: item.createDate,
                            views: item.views,
                            likes: item.likes,
                            author: item.nickName,
                            labels: item.labels,
                        }
                        return temp;
                    }) || prevState.data
            }))
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <>
                <section className="control-group">
                    <div className="order">
                        <a href="/blog"><Typography>按时间</Typography></a>
                        <Typography>&nbsp;|&nbsp;</Typography>
                        <a href="/blog"><Typography>按热度</Typography></a>
                    </div>
                    <div className="opreation">
                        <div className="custom-button">
                            <Typography variant="subtitle1"><Link to="/blog/create">+ CREATE</Link></Typography>
                        </div>
                    </div>
                </section>
                <section>
                    <BlogList data={this.state.data} />
                </section>
            </>
        )
    }
}


const Blog: React.FunctionComponent = () => {

    return (
        <main id="blog-main" className="golbal-container">
            <div className="container" style={{minHeight: '70vh'}}>
                <Switch>
                    <Route path="/blog/detail/:title" component={BlogDetail}></Route>
                    <Route path="/blog/create" component={BlogWritter}></Route>
                    <Route path="/blog" component={BlogOverview}></Route>
                </Switch>
            </div>
        </main>
    );
}

export default Blog;