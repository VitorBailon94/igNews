import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscriberButton } from '../components/SubscriberButton';
import { stripe } from '../services/stripes';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get access to all publications <br />
            <span>
              for {product.amount} month
            </span>
          </p>
          <SubscriberButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IYZEoHCy1F39AiHidO8EYP7', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-Us', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}
