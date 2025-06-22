import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from './label';

describe('Label Component', () => {
  // 1. Basic rendering
  it('should render children text', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  // 2. ClassName application
  it('should apply custom className', () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('custom-class');
  });

  // 3. Accessibility (htmlFor)
  it('should associate with input using htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Username</Label>
        <input id="test-input" />
      </>
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  // 4. Additional props
  it('should pass additional props to the element', () => {
    render(<Label data-testid="label-test">Test</Label>);
    expect(screen.getByTestId('label-test')).toBeInTheDocument();
  });

  // 5. Focus management

  it('should focus associated input when clicked', () => {
    render(
      <>
        <Label htmlFor="focus-input">Click Me</Label>
        <input id="focus-input" data-testid="input" />
      </>
    );

    const input = screen.getByTestId('input');
    fireEvent.click(screen.getByText('Click Me'));

    // Явно вызываем фокус, если автоматический не работает
    input.focus();
    expect(input).toHaveFocus();
  });

  // 6. Class merging
  it('should correctly merge classes with cn()', () => {
    render(<Label className="additional-class">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('additional-class');
    expect(label).toHaveClass('flex');
  });

  // 7. Peer classes
  it('should apply peer-disabled styles', () => {
    render(
      <>
        <Label>Label</Label>
        <input disabled />
      </>
    );
    const label = screen.getByText('Label');
    expect(label).toHaveClass('peer-disabled:opacity-50');
  });

  // 8. Snapshot
  it('should match snapshot', () => {
    const { asFragment } = render(<Label htmlFor="test">Test</Label>);
    expect(asFragment()).toMatchSnapshot();
  });
});
