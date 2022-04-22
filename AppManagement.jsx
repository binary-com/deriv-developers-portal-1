import { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import './AppRegistration.scss';
import styles from './AppManagement.module.scss';
import { useApps } from './useApps';
import SkeletonText from './components/SkeletonText/SkeletonText';

const columns = [
    {
        Header: "Users",
        accessor: "name",
    },
    {
        Header: "Application ID",
        accessor: "app_id",
    },
    {
        Header: "Scopes",
        accessor: "scopes",
        Cell: ({ cell: { value } }) => (value.join(', '))
    },
    {
        Header: "Redirect URL",
        accessor: "redirect_uri",
    }
];

export default function AppManagement() {
    const { data, isLoading } = useApps();
    const table_data = useMemo(() => data?.app_list || [], [data]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: table_data,
    }, useSortBy);
    return (
        <div className={styles.manageApps}>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? '↓'
                                                : '↑'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {isLoading && <SkeletonRows />}
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const SkeletonRows = () => {
    const Skeleton = () => (<tr>
        <td><SkeletonText /></td>
        <td><SkeletonText /></td>
        <td><SkeletonText /></td>
        <td><SkeletonText /></td>
        <td><SkeletonText /></td>
    </tr>);
    // return 5 skeletons
    return [...Array(5)].map((_, i) => <Skeleton key={i} />);
}
