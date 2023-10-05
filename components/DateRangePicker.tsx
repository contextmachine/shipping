import type { Dayjs } from 'dayjs';
import type { TimeRangePickerProps } from 'antd';
import { DateRange } from "@/utils/types";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker

interface DateRangePickerComponentProps {
    dateRange: DateRange | undefined | null,
    setDateRange: (range: DateRange | null) => void
}

export default function DateRangePickerComponent(props: DateRangePickerComponentProps) {

    const { dateRange, setDateRange } = props

    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: 'Вчера', value: [dayjs().add(-1, 'd').startOf('day'), dayjs().add(-1, 'd').endOf('day')] },
        { label: 'Сегодня', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
        { label: 'Последние 7 дней', value: [dayjs().add(-6, 'd').startOf('day'), dayjs().endOf('day')] },
        { label: 'За все время', value: [dayjs('2023-07-01 00:00').startOf('day'), dayjs().endOf('day')] },
    ];

    const onRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0].startOf('day'), dates[1].endOf('day')])
        } else {
            setDateRange(null)
        }
    }

    return <>
        <RangePicker
            placeholder={['Выберите период', '']}
            format="DD.MM.YY"
            onChange={(e, _) => onRangeChange(e)}
            presets={rangePresets}
            value={dateRange}
        />
    </>


}