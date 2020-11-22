import * as React from 'react';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import SnackBar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Api from '../../Api/api';
import {Link} from 'react-router-dom';
import marked from 'marked';


type IProps = {
    onClick: any;
}

interface IState {
    title: string;
    description: string;
    content: string;
    nickName: string;
    labels: string;
    [key: string]: string;
}

interface IFromValidater {
    hasError: boolean;
    errorMsg: string;
}

type IOpen = boolean;

const BlogWritter: React.FunctionComponent<IProps> = (props: IProps) => {
    const [data, setData] = React.useState<IState>({
        title: '',
        description: '',
        content: '',
        nickName: '',
        labels: ''
    });
    const [formValidater, setFormValidater] = React.useState<IFromValidater>({
        hasError: false,
        errorMsg: '',
    });
    const [open, setOpen] = React.useState<IOpen>(false);
    const [radioValue, setRadioValue] = React.useState("Plain Text");

    const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const newState: IState = {
            ...data,
            content: e.currentTarget.value
        }
        setData(newState);
    }
    const handleNickNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newState: IState = {
            ...data,
            nickName: e.currentTarget.value
        }
        setData(newState);
    }
    const handleLabelsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newState: IState = {
            ...data,
            labels: e.currentTarget.value
        }
        setData(newState);
    }
    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newState: IState = {
            ...data,
            title: e.currentTarget.value
        }
        setData(newState);
    }
    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newState: IState = {
            ...data,
            description: e.currentTarget.value
        }
        setData(newState);
    }
    const validateForm = () => {
        type IResult = {
            hasError: boolean;
            errorMsg: string;
            data?: null | object;
        }
        let res: IResult = {
            hasError: false,
            errorMsg: '',
        }
        let [title, description, content, nickName, labels ] = Object.keys(data).map(e => data[e].trim());
        if (title.length < 2 || title.length > 50) {
            res.hasError = true;
            res.errorMsg = '标题长度请控制在2-50之间';
        } else if (content.length < 15) {
            res.hasError = true;
            res.errorMsg = '正文内容过于简单';
        } else if (nickName.length < 2 || nickName.length > 15) {
            res.hasError = true;
            res.errorMsg = '昵称长度请控制在2-15之间';
        } else if (nickName.indexOf(' ') !== -1) {
            res.hasError = true;
            res.errorMsg = '昵称不允许使用空格';
        } else if (labels.indexOf('；') !== -1) {
            res.hasError = true;
            res.errorMsg = '标签不允许使用空格';
        }
        if (res.hasError) {
            res.data = null;
            return res;
        } else {
            const newLabels = labels.split(";").filter(e => e === "" ? false : true);
            if (description.length === 0) {
                description = content.slice(0, 40) + "...";
            }
            res.data = {
                title,
                description,
                content,
                nickName,
                labels: newLabels,
                useMarkdown: radioValue === "Markdown" ? true : false
            }
            return res;
        }
    }
    const onFinish = async () => {
        /**
         * 如果hasError === true
         * {
         *      hasError： true
         *      errorMsg： 非空
         *      data：null
         * }
         */
        const { hasError, errorMsg, data } = validateForm();
        
        if (!hasError) {
            
            const _data = await Api({
                url: '/api/createblog',
                method: 'POST',
                body: data
            })
            
            setFormValidater({
                ...formValidater,
                errorMsg: _data.json().msg
            })
            setOpen(true);
        } else {
            setFormValidater({
                hasError: hasError,
                errorMsg: errorMsg
            })
            setOpen(hasError);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleRadioChange = () => {
        if (radioValue === "Plain Text") {
            setRadioValue("Markdown");
        } else  {
            setRadioValue("Plain Text");
        }

    }
    return (
        <>
            <SnackBar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={formValidater.errorMsg}
            />
            <Typography variant="body1">标题</Typography>
            <Input value={data.title} onChange={handleTitleChange} fullWidth></Input>
            <Typography variant="body1" style={{marginTop: '15px'}}>概要</Typography>
            <Input value={data.description} onChange={handleDescriptionChange} fullWidth></Input>
            <Typography variant="body1" style={{marginTop: '15px'}}>正文</Typography>
            <RadioGroup name="useMarkdown" value={radioValue} onChange={handleRadioChange}>
                <FormControlLabel value="Plain Text" control={<Radio />} label="Plain Text (default)" />
                <FormControlLabel value="Markdown" control={<Radio />} label="Markdown (recommand)" />
            </RadioGroup>
            <section>
                <textarea
                    className="customTextarea"
                    autoFocus={true}
                    onChange={handleContentChange}
                    value={data.content}
                    >
                </textarea>
                {
                    radioValue === "Markdown"? 
                    < section dangerouslySetInnerHTML={{ __html: marked(data.content) }}></section>
                    : null
                }
            </section>

            <div className="form">
                <div>
                    <Input onChange={handleNickNameChange} value={data.nickName} placeholder="昵称"></Input>
                    <span>(必填)昵称长度请介于2-15个字符之间</span>
                </div>
                <div>
                    <Input onChange={handleLabelsChange} value={data.labels} placeholder="标签 例如'日常;吐槽'"></Input>
                    <span>(选填)请用英文分号&nbsp;;&nbsp;隔开</span>
                </div>
            </div>
            <div className="form-action">
                <div className="custom-button red-btn small-btn">
                    <Typography variant="subtitle2">
                        <Link to="/blog">
                            Back
                        </Link>
                    </Typography>
                </div>
                <div className="custom-button blue-btn small-btn">
                    <Typography variant="subtitle2" onClick={onFinish} style={{color: 'white'}}>Finish!</Typography>
                </div>
            </div>
        </>
    )
}


export default BlogWritter;