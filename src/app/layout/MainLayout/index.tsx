import React from 'react';
import Head from './component/Head';
import styles from './index.scss';
export default class MainLayout extends React.Component {

    render() {
        return(
            <div className={styles.container}>
                <Head/>
                <div className={styles.content}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
