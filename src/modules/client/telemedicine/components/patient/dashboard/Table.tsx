import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TAppointments } from "@/modules/shared/entities/models/telemedicine/dashboard";

interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: TAppointments;
}

export const TableComp = ({ columns, renderRow, data }: TableProps) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(({ header, key, className }) => (
              <TableHead key={key} className={className || undefined}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 &&
            data?.map((item, index) => renderRow({ ...item, index }))}
        </TableBody>
      </Table>
      {data?.length < 1 && <p className="py-8 text-center">No Data Found</p>}
    </div>
  );
};
