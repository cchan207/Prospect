import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('Jan', 2),
  createData('Feb', 0),
  createData('Mar', 0),
  createData('Apr', 0),
  createData('May', 0),
  createData('Jun', 0),
  createData('Jul', 3),
  createData('Aug', 20),
  createData('Sep', 20),
  createData('Oct', 15),
  createData('Nov', 5),
  createData('Dec', 2),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Past Year</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
              }}
            >
              Applications
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
