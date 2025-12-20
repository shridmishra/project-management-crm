import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from './page'
import { authClient } from '@/lib/auth-client'

// Mock the auth client
jest.mock('@/lib/auth-client')

describe('SignIn Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders sign in form', () => {
        render(<SignInPage />)
        expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getAllByRole('button').find(b => b.textContent?.includes('Sign In'))).toBeInTheDocument()
    })

    it('handles email sign in', async () => {
        render(<SignInPage />)

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })

        const buttons = screen.getAllByRole('button', { name: /sign in/i })
        const signInBtn = buttons.find(b => !b.textContent?.match(/google/i))
        fireEvent.click(signInBtn!)

        await waitFor(() => {
            expect(authClient.signIn.email).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                callbackURL: '/dashboard',
            }, expect.any(Object))
        })
    })

    it('handles google sign in', async () => {
        render(<SignInPage />)

        fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

        await waitFor(() => {
            expect(authClient.signIn.social).toHaveBeenCalledWith({
                provider: 'google',
                callbackURL: '/dashboard',
            })
        })
    })
})
