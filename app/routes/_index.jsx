import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense, useState, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const newArrivalsCollection = collections.nodes[1];
  const restOfCollections = [...collections.nodes].slice(2);
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({
    featuredCollection,
    newArrivalsCollection,
    restOfCollections,
    recommendedProducts,
  });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  console.log(data);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window
      .matchMedia('(max-width:700px)')
      .addEventListener('change', (e) => setIsMobile(e.matches));
    if (window.matchMedia('(max-width:700px)').matches) setIsMobile(true);
  }, []);

  return (
    <div className="home">
      {isMobile ? (
        <MobileNewArrivals collection={data.newArrivalsCollection} />
      ) : (
        <NewArrivals collection={data.newArrivalsCollection} />
      )}
      <FeaturedProducts
        products={data.featuredCollection.products.nodes}
        isMobile={isMobile}
      />
      <Categories categories={data.restOfCollections} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function NewArrivals({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <>
      <div className="new-arrivals-container">
        <p>{collection.title}</p>
        <div className="new-arrivals-text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi.
          </p>
          <a>Discover</a>
        </div>
      </div>
      <Link
        className="new-arrivals-collection"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <Image
            data={image}
            sizes="66vw"
            className="new-arrivals-collection-image"
          />
        )}
      </Link>
    </>
  );
}

function MobileNewArrivals({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <div className="mobile-new-arrivals">
      <div className="title-container">
        <p className="title">{collection.title}</p>
      </div>
      <Link
        className="new-arrivals-collection"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <Image
            data={image}
            sizes="66vw"
            className="new-arrivals-collection-image"
          />
        )}
      </Link>
      <div className="new-arrivals-text">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
          ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
          massa, varius a, semper congue, euismod non, mi.
        </p>
        <a>Discover</a>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function FeaturedProducts({products, isMobile}) {
  if (!products) return null;
  const endOfSlice = isMobile ? 9 : 6;
  return (
    <div className="subgrid">
      <div className="title-container">
        <p className="title">Featured Products</p>
      </div>
      {products.slice(0, endOfSlice).map((product, i) => {
        if (i === 0 && isMobile)
          return <MainFeaturedProduct product={product} key={product.id} />;
        else return <FeaturedProduct product={product} key={product.id} />;
      })}
    </div>
  );
}

function MainFeaturedProduct({product}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      if (index === product.images.nodes.length - 1) setIndex(0);
      else setIndex(index + 1);
    }, 2000);
  });
  return (
    <Link
      className="main-featured-product"
      to={`/products/${product.handle}`}
      style={{border: '1px solid pink'}}
    >
      <div style={{background: '#f4f4f4'}}>
        {/* <AnimatePresence mode="wait" initial={false}> */}
        <motion.div
          key={index}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
        >
          <Image
            data={product.images.nodes[index]}
            aspectRatio="1/1.2"
            crop={false}
            sizes="(min-width: 45em) 20vw, 50vw"
          />
        </motion.div>
        {/* </AnimatePresence> */}
      </div>
      <div className="product-details-container">
        <div className="product-title-price">
          <p>{product.title}</p>
          <small>
            <Money data={product.priceRange.minVariantPrice} />
          </small>
        </div>
        {/* <div className="product-color-variants">
          <p>+2 Colors</p>
        </div> */}
      </div>
      <div className="product-title-description">
        <p>{product.description}</p>
        <p style={{textDecoration: 'underline'}}>View Product</p>
      </div>
    </Link>
  );
}

function FeaturedProduct({product}) {
  const [index, setIndex] = useState(0);
  return (
    <Link
      className="featured-product"
      to={`/products/${product.handle}`}
      onMouseEnter={() => setIndex(1)}
      onMouseLeave={() => setIndex(0)}
    >
      <div style={{background: '#f4f4f4'}}>
        {/* <AnimatePresence mode="wait" initial={false}> */}
        <motion.div
          key={index}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
        >
          <Image
            data={product.images.nodes[index]}
            aspectRatio="1/1.2"
            crop={false}
            sizes="(min-width: 45em) 20vw, 50vw"
          />
        </motion.div>
        {/* </AnimatePresence> */}
      </div>
      <div className="product-details-container">
        <div className="product-title-price">
          <p>{product.title}</p>
          <small>
            <Money data={product.priceRange.minVariantPrice} />
          </small>
        </div>
        <div className="product-color-variants">
          <p>+2 Colors</p>
        </div>
      </div>
    </Link>
  );
}

function Categories({categories}) {
  return (
    <>
      <div className="title-container">
        <p className="title">Categories</p>
      </div>
      {categories.map((category) => (
        <Link
          key={category.handle}
          className="category-collection"
          to={`/collections/${category.handle}`}
        >
          <Image
            data={category.image}
            aspectRatio="1/1.2"
            sizes="(min-width: 45em) 20vw, 50vw"
            className="category-image"
          />
          <p
            style={{fontFamily: 'regular-font', fontSize: '.75rem'}}
          >{`Shop ${category.title}`}</p>
        </Link>
      ))}
    </>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    products(first: 9) {
      nodes {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 4) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: ID) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
