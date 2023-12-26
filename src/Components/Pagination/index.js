import React from 'react';
import styles from './Pagination.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Pagination({listItem, itemsPerPage, setCurrentPage, currentPage}) {
    return (
    <div className={cx('pagination')}>
        {listItem.length > itemsPerPage && (
            <ul>
                {Array(Math.ceil(listItem.length / itemsPerPage))
                    .fill()
                    .map((_, i) => (
                        <li
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={cx(`${i + 1 === currentPage ? 'active' : ''}`)}
                        >
                            {i + 1}
                        </li>
                    ))}
            </ul>
        )}
    </div>)

}
export default Pagination;