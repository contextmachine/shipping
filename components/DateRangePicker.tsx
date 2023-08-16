import { DateRange } from "@/utils/types";
import { DateRangePicker } from "rsuite";
import { startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { RangeType } from "rsuite/esm/DatePicker";

const ranges: RangeType<DateRange>[] = [
    {
        label: 'Сегодня',
        value: [startOfDay(new Date()), endOfDay(new Date())]
    },
    {
        label: 'Вчера',
        value: [startOfDay(addDays(new Date(), -1)), endOfDay(addDays(new Date(), -1))]
    },
    {
        label: 'Последние 7 дней',
        value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())]
    },
    {
        label: 'За все время',
        value: [new Date('2023-07-01T00:00:00.728Z'), endOfDay(new Date())]
    }
]


interface DateRangePickerComponentProps {
    dateRange: DateRange | undefined | null,
    setDateRange: (range: DateRange | undefined | null) => void
}

export default function DateRangePickerComponent(props: DateRangePickerComponentProps) {

    const { dateRange, setDateRange } = props

    return <DateRangePicker
        placeholder={'Выберите период'}
        showOneCalendar={true}
        value={dateRange}
        onChange={setDateRange}
        format="dd.MM.yy"
        ranges={ranges as any}
    />
}