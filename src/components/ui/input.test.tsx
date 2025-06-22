import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './input';

describe('Input Component', () => {
  it('renders input', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays passed value', () => {
    render(<Input value="Test" />);
    expect(screen.getByRole('textbox')).toHaveValue('Test');
  });

  it('calls onChange when typed', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hi' } });
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('Hi');
  });

  it('is disabled when disabled prop passed', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('has label association', () => {
    render(
      <>
        <label htmlFor="user">User</label>
        <Input id="user" />
      </>
    );
    expect(screen.getByLabelText('User')).toBeInTheDocument();
  });
});
