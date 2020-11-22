import * as React from 'react';
import Chip from '@material-ui/core/Chip';

type IProps = {
    datas: string[];
}


const PillList: React.FunctionComponent<IProps> = (props: IProps) => {
    const randomColor = ['#34495e'];
    const { datas } = props;
    return (
        <>
            {
                datas.map(v => <Chip
                    size="small"
                    label={v} key={v}
                    style={{
                        color: '#fff',
                        backgroundColor: randomColor[Math.floor(Math.random() * randomColor.length)],
                        padding: '0 5px 0 3px',
                        margin: '0 10px 0 0'
                    }}
                />)
            }
        </>
    )
}

export default PillList;