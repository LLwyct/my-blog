import * as React from 'react';
import styles from './Cards.module.css';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@material-ui/core";

const myCard: React.FunctionComponent = () => {

  const data = [
    {
      title: '我的博客',
      description: '我会在这里分享一些技术内容、日常吐槽等一切我想要记录或唠叨的东西',
      to: '/blog'
    },
    {
      title: '喜欢的音乐',
      description: '这里是一个我自己写的可视化网页播放器，我会推荐一些我喜欢的歌在里面',
      to: '/music'
    },
    {
      title: '喜欢的壁纸',
      description: '我会在这里分享一些我喜欢的壁纸，从动漫、游戏到军事、风景、人物，应有尽有。还会推荐一些手机壁纸',
      to: '/wallpaper'
    },
  ]

  const Cards = data.map((item) =>
    <Grid item container lg={3} md={4} sm={6} xs={12} direction="column" justify="space-between" key={item.title}>
      <Card className={styles.ccard}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="subtitle1">
            {item.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button component={Link} to={item.to}>
            <Typography variant="button" style={{ fontWeight: 'bold'}} className="useNun">
            READ MORE
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
  return (
    <Grid container spacing={3}>
      {Cards}
    </Grid>
  );
}

export default myCard;
