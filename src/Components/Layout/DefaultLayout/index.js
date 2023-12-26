import Header  from "../components/Header";
import Nav from "../components/NavCategory";

import styles from './DefaultLayout.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function DefaultLayout({children}) {
    return (
        <>
            <Header/>
            <div className={cx("body")}>
            <Nav/>
            {children}
            </div>
        </>
    );
}

export default DefaultLayout;