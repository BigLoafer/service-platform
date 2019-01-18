import { Svg } from 'app/ui';
import React from 'react';
import styles from './ErrorPage.scss';
export default class ErrorPage extends React.Component {

    retry = () => {
        window.location.reload();
    }
    
    render() {
        return(
            <div className={styles.container}>
                <Svg name="pageError" className="errorImg"/>
                <span>页面加载错误!!!</span>
                <span className={styles.retry} onClick={this.retry}>点击重试</span>
            </div>
        );
    }
}