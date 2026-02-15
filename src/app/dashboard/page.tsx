'use client';

import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/context';
import { EMISSION_FACTORS } from '@/lib/types';
import { TrendingUp, Factory, Leaf, CalendarDays } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmissionsLineChart, BreakdownPieChart } from '@/components/dashboard-charts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { type DateRange } from 'react-day-picker';
import { subDays, isWithinInterval } from 'date-fns';

export default function DashboardPage() {
  const { state } = useAppContext();
  const { operationalData } = state;

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filteredData = useMemo(() => {
    if (!operationalData || operationalData.length === 0) return [];
    if (!date?.from) return operationalData;
    
    // Ensure 'to' date is set for single-day selection
    const interval = {
        start: date.from,
        end: date.to || date.from,
    };

    return operationalData.filter(record => {
        try {
            // Safe date parsing
            const recordDate = new Date(record.date.replace(/-/g, '/'));
            return isWithinInterval(recordDate, interval);
        } catch (e) {
            console.error("Invalid date format for record:", record);
            return false;
        }
    });
  }, [operationalData, date]);


  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { totalEmissions: 0, emissionIntensity: 0, avgDailyEmissions: 0, periodDays: 0 };
    }
    const totalElectricity = filteredData.reduce((sum, record) => sum + record.electricity_kwh, 0);
    const totalDiesel = filteredData.reduce((sum, record) => sum + (record.fuel_type === 'diesel' ? record.fuel_amount : 0), 0);
    const totalCoal = filteredData.reduce((sum, record) => sum + (record.fuel_type === 'coal' ? record.fuel_amount : 0), 0);
    const totalNaturalGas = filteredData.reduce((sum, record) => sum + (record.fuel_type === 'natural_gas' ? record.fuel_amount : 0), 0);
    const totalPropane = filteredData.reduce((sum, record) => sum + (record.fuel_type === 'propane' ? record.fuel_amount : 0), 0);
    const totalProduction = filteredData.reduce((sum, record) => sum + record.production_units, 0);

    const totalEmissions =
      totalElectricity * EMISSION_FACTORS.electricityKgCo2PerKWh +
      totalDiesel * EMISSION_FACTORS.dieselKgCo2PerLiter +
      totalCoal * EMISSION_FACTORS.coalKgCo2PerKg +
      totalNaturalGas * EMISSION_FACTORS.naturalGasKgCo2PerM3 +
      totalPropane * EMISSION_FACTORS.propaneKgCo2PerLiter;

    const emissionIntensity = totalProduction > 0 ? totalEmissions / totalProduction : 0;
    const avgDailyEmissions = totalEmissions / filteredData.length;
    
    return {
      totalEmissions,
      emissionIntensity,
      avgDailyEmissions,
      periodDays: filteredData.length,
    };
  }, [filteredData]);

  const hasData = operationalData && operationalData.length > 0;
  const hasFilteredData = filteredData && filteredData.length > 0;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <PageHeader
            title="Dashboard"
            subtitle="An overview of your factory's carbon emissions."
            className="mb-0 flex-grow"
        />
        <DateRangePicker date={date} onDateChange={setDate} />
      </div>
      
      <div className="mt-6 space-y-6">
        {!hasData ? (
          <Alert>
            <Leaf className="h-4 w-4" />
            <AlertTitle>Welcome to EcoVision!</AlertTitle>
            <AlertDescription>
              You have no operational data yet. Go to the{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/dashboard/data-entry">Data Entry</Link>
              </Button>
              {' '}page to get started.
            </AlertDescription>
          </Alert>
        ) : !hasFilteredData ? (
          <Alert variant="destructive">
              <CalendarDays className="h-4 w-4" />
              <AlertTitle>No Data in Selected Range</AlertTitle>
              <AlertDescription>
                  There is no operational data for the selected date range. Please adjust the dates or add new data.
              </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEmissions.toFixed(2)} kg CO₂</div>
                  <p className="text-xs text-muted-foreground">For {stats.periodDays} day(s) in selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Daily Emissions</CardTitle>
                  <Factory className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgDailyEmissions.toFixed(2)} kg CO₂</div>
                  <p className="text-xs text-muted-foreground">Average per day in selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emission Intensity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.emissionIntensity.toFixed(2)} kg CO₂ / unit</div>
                  <p className="text-xs text-muted-foreground">Emissions per production unit</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <EmissionsLineChart data={filteredData} />
              <BreakdownPieChart data={filteredData} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
