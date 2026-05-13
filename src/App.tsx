import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExperimentCanvas } from './components/ExperimentCanvas';
import { NotFound } from './components/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /experiment/01-gsap-morphing → ExperimentCanvas busca ese id */}
        <Route path='/experiment/:id' element={<ExperimentCanvas />} />

        {/* Cualquier otra URL → 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
