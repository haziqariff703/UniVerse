# UniVerse Database Query Guide

This guide provides sample Mongoose queries for common operations in the UniVerse system. It covers basic CRUD (Create, Read, Update, Delete) and advanced operations used for business intelligence and analytics.

---

## 1. Basic CRUD Operations

### Create: Event Registration

Used when a student registers for an event. It includes atomicity and denormalization snapshots.

```javascript
const registerForEvent = async (userId, eventId) => {
  // 1. Transactional check and increment
  // Using findByIdAndUpdate with $inc ensures atomicity
  const event = await Event.findByIdAndUpdate(
    eventId,
    { $inc: { current_attendees: 1 } },
    { new: true, runValidators: true },
  );

  if (!event) throw new Error("Event not found");

  // 2. Create registration with snapshots for high-read performance
  const registration = await Registration.create({
    event_id: eventId,
    user_id: userId,
    status: "Confirmed",
    booking_time: new Date(),
    event_snapshot: {
      title: event.title,
      venue: event.venue_name, // Assuming venue_id is populated or snapshot exists
      date_time: event.date_time,
    },
    // user_snapshot would also be populated here from user data
  });

  return registration;
};
```

### Read: Fetch My Bookings with Event Details

Retrieves a user's registered events with populated venue information.

```javascript
const getMyBookings = async (userId) => {
  return await Registration.find({ user_id: userId })
    .populate({
      path: "event_id",
      select: "title date_time status ticket_price image",
      populate: {
        path: "venue_id",
        select: "name location_code",
      },
    })
    .sort({ booking_time: -1 });
};
```

### Update: Event Details (Authorization Check)

Updates event data ensuring the requester is either an Admin or the specific Organizer.

```javascript
const updateEvent = async (eventId, requester, updateData) => {
  const isAdmin = requester.roles.includes("admin");

  // Security filter: Allow if Admin or if IDs match
  const filter = isAdmin
    ? { _id: eventId }
    : { _id: eventId, organizer_id: requester.id };

  return await Event.findOneAndUpdate(
    filter,
    { $set: updateData },
    { new: true, runValidators: true },
  );
};
```

### Delete: Cancel Registration

Cancels a booking and atomically decrements the attendee count.

```javascript
const cancelBooking = async (registrationId) => {
  const reg = await Registration.findByIdAndUpdate(registrationId, {
    status: "Cancelled",
  });

  if (reg && reg.status !== "Cancelled") {
    // Revert attendee count only if it was previously confirmed
    await Event.findByIdAndUpdate(reg.event_id, {
      $inc: { current_attendees: -1 },
    });
  }
};
```

---

## 2. Advanced Operations

### Event Overlap Check (Venue Scheduling)

Critical logic to prevent booking conflicts at the same venue.

```javascript
const checkConflict = async (
  venueId,
  startTime,
  endTime,
  excludeEventId = null,
) => {
  const query = {
    venue_id: venueId,
    status: { $ne: "rejected" },
    $or: [
      {
        date_time: { $lt: endTime },
        end_time: { $gt: startTime },
      },
    ],
  };

  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }

  return await Event.findOne(query);
};
```

### Financial Analytics: Revenue & Registration Trends

Uses MongoDB Aggregation Framework to calculate monthly performance metrics.

```javascript
const getOrganizerAnalytics = async (organizerId) => {
  return await Registration.aggregate([
    {
      $match: {
        status: { $in: ["Confirmed", "CheckedIn"] },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "event_id",
        foreignField: "_id",
        as: "event_details",
      },
    },
    { $unwind: "$event_details" },
    {
      $match: {
        "event_details.organizer_id": mongoose.Types.ObjectId(organizerId),
      },
    },
    {
      $group: {
        _id: { $month: "$booking_time" },
        monthlyRevenue: { $sum: "$event_details.ticket_price" },
        registrationCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};
```

### Public Social Proof (Attendee Facepile)

Fetches the names of recent registrants to build community trust on event pages.

```javascript
const getEventFacepile = async (eventId) => {
  return await Registration.find({
    event_id: eventId,
    status: { $ne: "Cancelled" },
  })
    .select("user_snapshot.name")
    .sort({ booking_time: -1 })
    .limit(5);
};
```

---

## 3. Best Practices in UniVerse

| Practice              | Implementation                                  | Benefit                                                   |
| :-------------------- | :---------------------------------------------- | :-------------------------------------------------------- |
| **Atomic Increments** | Use `$inc` in Mongoose queries                  | Prevents race conditions during ticket rushes.            |
| **Denormalization**   | Store `event_snapshot` in registrations         | Reduces `$lookup` overhead for high-frequency list views. |
| **Soft Deletes**      | Use `status: 'Cancelled'` instead of `remove()` | Preserves audit trails and historical data.               |
| **Compound Indexes**  | Index on `{ event_id, user_id }`                | Prevents duplicate registrations at the database layer.   |
