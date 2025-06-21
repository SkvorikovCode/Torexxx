import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the Terminal component', () => {
    render(<App />);
    // Мы предполагаем, что в Terminal.tsx есть элемент с ролью 'main'
    // или какой-то другой уникальный идентификатор.
    // Давайте поищем текстовое поле ввода как более надежный селектор.
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });
}); 