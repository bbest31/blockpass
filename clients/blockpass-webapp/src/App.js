// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { ChartStyle } from './components/chart';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <NotistackProvider>
          <ProgressBarStyle />
          <ChartStyle />
          <Router />
        </NotistackProvider>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
