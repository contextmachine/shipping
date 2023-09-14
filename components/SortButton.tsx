import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useEffect, useState } from 'react';
import { SortState } from './ShippingList';


export type SortValue = 'none' | 'ascending' | 'descending'

interface SortButtonProps {
    field: string
    sortState: SortState,
    setSortState: (sortState: SortState) => void
}

export default function SortButton(props: SortButtonProps) {

    const { sortState, setSortState, field } = props
    const [state, setState] = useState<SortValue>('none')

    useEffect(() => {
        if (sortState.field === field) {
            setState(sortState.value)
        } else {
            setState('none')
        }
    }, [sortState, field])

    const switchValue = (value: SortValue) => {
        return value === 'none'
            ? 'ascending'
            : value === 'ascending'
                ? 'descending'
                : 'ascending'
    }

    const handleOnClick = () => {
        setSortState({ field: field, value: switchValue(state) })
    }

    return <button
        style={{ backgroundColor: 'white', border: 0 }}
        onClick={handleOnClick}
    >
        {(state === 'none' || state === 'ascending') &&
            <ArrowDropDownIcon
                color={state === 'none' ? 'disabled' : 'inherit'} />}
        {(state === 'descending') &&
            <ArrowDropUpIcon />}
    </button>
}