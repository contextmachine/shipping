import { DateRange } from "@/utils/types";
import { DateRangePicker } from "rsuite";
import { startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { RangeType } from "rsuite/esm/DatePicker";


const getRanges = (now: Date): RangeType<DateRange>[] => [
    {
        label: 'Сегодня',
        value: [startOfDay(now), endOfDay(now)]
    },
    {
        label: 'Вчера',
        value: [startOfDay(addDays(now, -1)), endOfDay(addDays(now, -1))]
    },
    {
        label: 'Последние 7 дней',
        value: [startOfDay(subDays(now, 6)), endOfDay(now)]
    },
    {
        label: 'За все время',
        value: [new Date('2023-07-01T00:00:00.728Z'), endOfDay(now)]
    }
]


interface DateRangePickerComponentProps {
    dateRange: DateRange | undefined | null,
    setDateRange: (range: DateRange | undefined | null) => void
}

export default function DateRangePickerComponent(props: DateRangePickerComponentProps) {

    const { dateRange, setDateRange } = props

    const ranges = getRanges(new Date())

    return <DateRangePicker
        placeholder={'Выберите период'}
        showOneCalendar={true}
        value={dateRange}
        onChange={setDateRange}
        format="dd.MM.yy"
        ranges={ranges as any}
    />
}