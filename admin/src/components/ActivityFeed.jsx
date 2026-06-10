export default function ActivityFeed({
  activities
}) {

  return (

    <div
      className="
      border
      rounded-xl
      p-4
      "
    >

      <h3
        className="
        font-semibold
        mb-3
        "
      >
        Activity
      </h3>

      {activities.map(
        (
          activity
        ) => (

          <div
            key={
              activity._id
            }
            className="
            py-2
            "
          >

            {
              activity.message
            }

          </div>

        )
      )}

    </div>

  );

}