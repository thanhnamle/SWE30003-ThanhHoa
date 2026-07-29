import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/common/Modal';

describe('Modal Component', () => {
  it('renders children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    // X icon acts as the close button inside the header
    const closeButtons = screen.getAllByRole('button');
    await userEvent.click(closeButtons[0]);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('unmounts after transition when isOpen becomes false', async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );

    act(() => {
      vi.advanceTimersByTime(250); // Modal transition takes 200ms
    });

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
