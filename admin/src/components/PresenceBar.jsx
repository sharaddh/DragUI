export default function PresenceBar({
  users
}) {

  return (

    <div
      className="
      flex
      gap-2
      px-4
      py-2
      border-b
      "
    >

      {users.map(
        (user) => (

          <div
            key={user.id}
            className="
            px-3
            py-1
            rounded-full
            bg-green-100
            text-green-700
            text-sm
            "
          >

            🟢 {user.name}

          </div>

        )
      )}

    </div>

  );

}