import { Suspense } from 'react';
import {
  useRouteLoaderData,
  redirect,
  Await,
} from 'react-router-dom';

import EventItem from '../components/EventItem';
import EventsList from '../components/EventsList';
import { ActionFunctionArgs } from 'react-router-dom';

import { LoaderFunctionArgs } from 'react-router-dom';

function EventDetailPage() {
  const { event, events } = useRouteLoaderData('event-detail') as any;

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id: string) {
  const response = await fetch('http://localhost:8080/events/' + id);

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
      status: 500,
    });
    
  } else {
    const resData = await response.json();
    return resData.events;
  }
}


export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.eventId;

  if (!id) {
    throw new Error('Invalid event ID.');
  }

  return {
    event: await loadEvent(id),
    events: loadEvents(),
  };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const eventId = params.eventId;
  const response = await fetch('http://localhost:8080/events/' + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not delete event.' }), {
      status: 500,
    });
  }
  return redirect('/events');
}
