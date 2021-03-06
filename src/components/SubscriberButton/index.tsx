import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscriberButtonProps {
  priceId: string;
}

export function SubscriberButton({ priceId }: SubscriberButtonProps) {
  const [session] = useSession();

  async function handleSubscriber() {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message);
    }

  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscriber}>
      Subscriber Now
    </button>
  )
}