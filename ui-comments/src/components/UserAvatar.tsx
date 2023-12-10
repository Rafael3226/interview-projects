import avatar from "../assets/avatar.png";

export default function UserAvatar({
  name,
  img = avatar,
  className,
}: {
  name: string;
  img?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4${className ? "" : " " + className}`}
    >
      <img className="w-8 h-8 rounded-full" src={img} alt="User Avatar" />
      <div className="font-medium dark:text-white">
        <div>{name}</div>
      </div>
    </div>
  );
}
