import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offer() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const numOfResults = 1;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings');

        // Create query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(numOfResults)
        );

        // Execute query
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach(doc =>
          listings.push({
            id: doc.id,
            data: doc.data(),
          })
        );

        const lastVisible =
          querySnap.docs.length === numOfResults &&
          querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  const onFetchMoreListing = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings');

      // Create query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(numOfResults)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach(doc =>
        listings.push({
          id: doc.id,
          data: doc.data(),
        })
      );

      const lastVisible =
        querySnap.docs.length === numOfResults &&
        querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      setListings(prevState => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading && <Spinner />}

      {listings && listings.length === 0 && <p>There are no Current Offers</p>}

      {listings && listings.length > 0 && (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map(listing => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing ? (
            <p className='loadMore' onClick={onFetchMoreListing}>
              Load More
            </p>
          ) : (
            <p
              style={{
                width: '100%',
                textAlign: 'center',
                margin: '0 auto',
                fontWeight: 700,
              }}
            >
              End of search results
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Offer;
