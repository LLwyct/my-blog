import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Cards from '../../components/Cards/Cards';
import './Home.scss';
import request from '../../Api/api';
import { IBlogFormat } from '../../components/BlogList/BlogList';
import {BlogList} from "../../components";

type IState = {
    data: Array<IBlogFormat>;
}

type requestDataFormat = {
    title: string;
    description: string;
    createDate: string;
    views: number;
    likes: number;
    nickName: string;
    labels: string[];
}

class Home extends React.Component<null, IState> {

    state: IState = {
        data: []
    }

    async componentDidMount() {
        try {
            const data = await request({
                url: "/api/getLastestBlogs",
                method: "GET",
            })
            
            this.setState({
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
                })
            })
        } catch (error) {

        }
    }

    render() {
        return (
            <>
                <div id="home-main" className="golbal-container">
                    <div>
                        <div className="cards">
                            <Cards></Cards>
                        </div>
                        <div className="websiite-news">
                            <section style={{ marginBottom: '30px' }}>
                                <Typography variant="h3">
                                    最新文章
                                </Typography>
                            </section>
                            <section>
                                {
                                    this.state.data.length ===0
                                        ?<Typography variant="body1">
                                            暂时什么都还没有...
                                        </Typography>
                                        : <BlogList data={this.state.data} />
                                    }
                            </section>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;